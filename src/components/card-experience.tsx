"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import Image from "next/image";
import type { BankAccount, Profile } from "@/data/profile";
import { Icon } from "@/components/icon";
import { BankAccountCard } from "@/components/bank-account-card";

type DialogContent = { title: string; account?: BankAccount; kind: "share" | "bank" };

function subscribeToUrl() {
  return () => {};
}

function getUrlSnapshot() {
  return window.location.href;
}

function getServerUrlSnapshot() {
  return "";
}

export function CardExperience({ profile }: { profile: Profile }) {
  const [dialog, setDialog] = useState<DialogContent | null>(null);
  const [toast, setToast] = useState("");
  const [dialogFeedback, setDialogFeedback] = useState("");
  const [selectedBankId, setSelectedBankId] = useState(profile.bankAccounts[0]?.id ?? "");
  const currentUrl = useSyncExternalStore(subscribeToUrl, getUrlSnapshot, getServerUrlSnapshot);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);
  const feedbackSequenceRef = useRef(0);
  const showDialogFrameRef = useRef<number | null>(null);
  const restoreFocusFrameRef = useRef<number | null>(null);
  const dialogSequenceRef = useRef(0);

  function clearFeedbackTimer() {
    feedbackSequenceRef.current += 1;
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  }

  function clearDialogFrames() {
    dialogSequenceRef.current += 1;
    if (showDialogFrameRef.current !== null) {
      window.cancelAnimationFrame(showDialogFrameRef.current);
      showDialogFrameRef.current = null;
    }
    if (restoreFocusFrameRef.current !== null) {
      window.cancelAnimationFrame(restoreFocusFrameRef.current);
      restoreFocusFrameRef.current = null;
    }
  }

  useEffect(() => () => {
    feedbackSequenceRef.current += 1;
    if (feedbackTimerRef.current !== null) window.clearTimeout(feedbackTimerRef.current);
    dialogSequenceRef.current += 1;
    if (showDialogFrameRef.current !== null) window.cancelAnimationFrame(showDialogFrameRef.current);
    if (restoreFocusFrameRef.current !== null) window.cancelAnimationFrame(restoreFocusFrameRef.current);
  }, []);

  useLayoutEffect(() => {
    if (!dialog) return;

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const root = document.documentElement;
    const body = document.body;
    const originalRootStyle = root.getAttribute("style");
    const originalBodyStyle = body.getAttribute("style");
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const trapDialogTab = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const modal = dialogRef.current;
      if (!modal?.open) return;

      const focusable = Array.from(modal.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
      )).filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!first || !last) {
        event.preventDefault();
        modal.focus();
      } else if (!modal.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    root.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = `-${scrollX}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    document.addEventListener("keydown", trapDialogTab, true);

    return () => {
      document.removeEventListener("keydown", trapDialogTab, true);
      if (originalRootStyle === null) root.removeAttribute("style");
      else root.setAttribute("style", originalRootStyle);
      if (originalBodyStyle === null) body.removeAttribute("style");
      else body.setAttribute("style", originalBodyStyle);
      window.scrollTo(scrollX, scrollY);
    };
  }, [dialog]);

  function announce(message: string) {
    clearFeedbackTimer();
    const sequence = feedbackSequenceRef.current;
    const insideDialog = dialogRef.current?.open ?? false;
    if (insideDialog) {
      setDialogFeedback(message);
      setToast("");
    } else {
      setToast(message);
      setDialogFeedback("");
    }
    feedbackTimerRef.current = window.setTimeout(() => {
      if (sequence !== feedbackSequenceRef.current) return;
      if (insideDialog) setDialogFeedback("");
      else setToast("");
      feedbackTimerRef.current = null;
    }, 2800);
  }

  function openDialog(content: DialogContent) {
    clearDialogFrames();
    clearFeedbackTimer();
    setToast("");
    setDialogFeedback("");
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const sequence = dialogSequenceRef.current;
    setDialog(content);
    showDialogFrameRef.current = window.requestAnimationFrame(() => {
      showDialogFrameRef.current = null;
      if (sequence === dialogSequenceRef.current && !dialogRef.current?.open) dialogRef.current?.showModal();
    });
  }

  function handleDialogClose() {
    if (showDialogFrameRef.current !== null || dialogRef.current?.open) return;
    const returnFocus = returnFocusRef.current;
    returnFocusRef.current = null;
    clearFeedbackTimer();
    setDialogFeedback("");
    dialogSequenceRef.current += 1;
    const sequence = dialogSequenceRef.current;
    setDialog(null);
    if (restoreFocusFrameRef.current !== null) window.cancelAnimationFrame(restoreFocusFrameRef.current);
    restoreFocusFrameRef.current = window.requestAnimationFrame(() => {
      restoreFocusFrameRef.current = null;
      if (sequence === dialogSequenceRef.current && !dialogRef.current?.open && returnFocus?.isConnected) {
        returnFocus.focus({ preventScroll: true });
      }
    });
  }

  function handleBankTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastIndex = profile.bankAccounts.length - 1;
    const nextIndex = event.key === "ArrowRight"
      ? (index + 1) % profile.bankAccounts.length
      : event.key === "ArrowLeft"
        ? (index - 1 + profile.bankAccounts.length) % profile.bankAccounts.length
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? lastIndex
            : index;

    if (nextIndex === index) return;
    event.preventDefault();
    const nextAccount = profile.bankAccounts[nextIndex];
    if (!nextAccount) return;
    setSelectedBankId(nextAccount.id);
    document.getElementById(`bank-tab-${nextAccount.id}`)?.focus();
  }

  async function copyText(value: string, what: string) {
    try {
      await navigator.clipboard.writeText(value);
      announce(`Đã sao chép ${what}.`);
    } catch {
      announce(`Không thể sao chép ${what}. Vui lòng thử lại.`);
    }
  }

  async function sharePage() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Phuc Card — ${profile.fullName}`, text: profile.jobTitle, url });
        announce("Đã mở bảng chia sẻ.");
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") await copyText(url, "liên kết");
      }
    } else {
      await copyText(url, "liên kết");
    }
  }

  function saveContact() {
    const escapeVcf = (value: string) => value.replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
    const lines = [
      "BEGIN:VCARD", "VERSION:3.0", `FN:${escapeVcf(profile.fullName)}`,
      `N:${escapeVcf(profile.familyName)};${escapeVcf(profile.givenName)};;;`,
      `TITLE:${escapeVcf(profile.jobTitle)}`,
      `TEL;TYPE=CELL:${escapeVcf(profile.phoneNumber)}`,
      ...profile.contacts.map((contact) => `URL:${escapeVcf(contact.href)}`),
      "END:VCARD",
    ];
    const blob = new Blob([`${lines.join("\r\n")}\r\n`], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ho-thanh-phuc.vcf";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce("Đã tải danh bạ về thiết bị.");
  }

  async function downloadQr(account: BankAccount) {
    if (!account.qrImage) return;
    try {
      const response = await fetch(account.qrImage.originalSrc);
      if (!response.ok) throw new Error("Tải ảnh thất bại");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = account.qrImage.originalSrc.split("/").pop() ?? `ma-qr-${account.id}.jpg`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      announce("Đã tải ảnh QR.");
    } catch {
      announce("Không tải được ảnh QR. Hãy kiểm tra đường dẫn ảnh trong cấu hình.");
    }
  }

  const shareQr = currentUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&data=${encodeURIComponent(currentUrl)}`
    : "";

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="topbar">
        <a className="wordmark" href="#main" aria-label="Thanh Phúc — về đầu trang"><Image className="wordmark-logo" src="/images/logo-thanh-phuc-display.png" alt="" width={1695} height={385} priority unoptimized /></a>
      </header>

      <div className="page-main" id="main">
        <section className="profile-panel" aria-labelledby="profile-name">
          <div className="portrait-wrap">
            <div className="portrait-orbit" aria-hidden="true"><span /><span /><span /></div>
            <div className="portrait">
              {profile.avatar ? <Image src={profile.avatar.src} alt={profile.avatar.alt} fill sizes="(max-width: 650px) 112px, 144px" loading="eager" unoptimized style={{ objectFit: "cover", objectPosition: profile.avatar.objectPosition }} /> : <span className="portrait-initials">HP</span>}
            </div>
            <span className="portrait-seal" aria-label="Hồ sơ cá nhân"><Icon name="sparkle" /></span>
          </div>
          <h1 id="profile-name">{profile.fullName}<span className="name-period">.</span></h1>
          <div className="role-line"><span className="role-dash" />{profile.jobTitle}</div>

          <div className="hero-actions">
            <button className="button button-primary" onClick={saveContact}><Icon name="download" /> Lưu liên hệ</button>
            <button className="button button-secondary" onClick={() => openDialog({ kind: "share", title: "Chia sẻ" })}><Icon name="share" /> Chia sẻ</button>
          </div>
        </section>

        <section className="details-panel" aria-label="Thông tin liên hệ và ngân hàng">
          <section className="contact-section" aria-labelledby="contact-heading">
            <div className="section-heading"><h2 id="contact-heading">Liên hệ</h2><Icon className="heading-icon" name="link" /></div>
            <div className="contact-list">
              {profile.contacts.map((contact) => <a className="contact-row" key={contact.id} href={contact.href} target="_blank" rel="noopener noreferrer">
                <span className="contact-icon"><Icon name={contact.id === "github" || contact.id === "facebook" || contact.id === "zalo" ? contact.id : "external"} /></span>
                <span className="contact-copy"><span className="contact-label">{contact.label}</span><span className="contact-value">{contact.value}</span></span>
                <Icon className="contact-arrow" name="arrow" />
              </a>)}
              {profile.contacts.length === 0 && <p className="empty-contact">Chưa có thông tin liên hệ.</p>}
            </div>
          </section>

          <div className="section-divider" />

          <section className="bank-section" aria-labelledby="bank-heading">
            <div className="section-heading"><h2 id="bank-heading">Chuyển khoản</h2><Icon className="heading-icon" name="bank" /></div>
            {profile.bankAccounts.length > 0 ? <>
              <div className="bank-selector" role="tablist" aria-label="Chọn tài khoản">
                {profile.bankAccounts.map((account, index) => <button
                  key={account.id}
                  id={`bank-tab-${account.id}`}
                  type="button"
                  role="tab"
                  className="bank-selector-button"
                  aria-selected={selectedBankId === account.id}
                  aria-controls={`bank-panel-${account.id}`}
                  tabIndex={selectedBankId === account.id ? 0 : -1}
                  onClick={() => setSelectedBankId(account.id)}
                  onKeyDown={(event) => handleBankTabKeyDown(event, index)}
                >{account.bankName}</button>)}
              </div>
              {profile.bankAccounts.map((account) => <div
                key={account.id}
                id={`bank-panel-${account.id}`}
                role="tabpanel"
                aria-labelledby={`bank-tab-${account.id}`}
                tabIndex={0}
                hidden={selectedBankId !== account.id}
              ><BankAccountCard
                  account={account}
                  onOpenQr={(selected) => openDialog({ kind: "bank", title: selected.bankName, account: selected })}
                  onCopyNumber={(selected) => {
                    const number = selected.accountNumber ?? selected.accountDisplay;
                    if (number) void copyText(number, selected.accountNumber ? "số tài khoản" : "số điện thoại");
                  }}
                  onDownloadQr={(selected) => void downloadQr(selected)}
                /></div>)}
            </> : <div className="bank-empty"><div className="empty-art" aria-hidden="true"><span className="empty-art-corner c1"/><span className="empty-art-corner c2"/><span className="empty-art-corner c3"/><span className="empty-art-corner c4"/><span className="empty-art-center"><Icon name="bank" /></span><i className="empty-dot d1"/><i className="empty-dot d2"/><i className="empty-dot d3"/><i className="empty-dot d4"/></div><p className="empty-title">Chưa cấu hình tài khoản ngân hàng</p><p className="empty-description">Thông tin sẽ xuất hiện tại đây khi được cập nhật.</p></div>}
          </section>

        </section>
      </div>

      <footer className="footer"><span>© {new Date().getFullYear()} PHUC CARD</span></footer>

      <dialog className="modal" ref={dialogRef} tabIndex={-1} aria-modal="true" onClose={handleDialogClose} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current?.close(); }} aria-labelledby="dialog-title">
        {dialog && <div className="modal-content"><div className="modal-top"><div><h2 id="dialog-title">{dialog.kind === "share" ? "Chia sẻ" : dialog.title}</h2></div><button className="icon-button close-button" aria-label="Đóng hộp thoại" onClick={() => dialogRef.current?.close()}><Icon name="close" /></button></div>
          {dialog.kind === "share" && shareQr ? <><a className="share-url" href={currentUrl} target="_blank" rel="noopener noreferrer">{currentUrl}</a><div className="share-qr-frame"><Image src={shareQr} alt="Mã QR mở trang Phuc Card" width={240} height={240} unoptimized /></div></> : dialog.account?.qrImage ? <div className="bank-qr-modal-frame"><div className="bank-qr-modal-image"><Image src={dialog.account.qrImage.src} alt={dialog.account.qrImage.alt} fill sizes="(max-width: 650px) calc(100vw - 72px), 560px" unoptimized style={{ objectFit: "contain" }} /></div><div className="bank-qr-modal-details"><span className="bank-detail-label">{dialog.account.label}</span><span className="bank-qr-modal-owner">{dialog.account.accountHolder}</span>{(dialog.account.accountNumber ?? dialog.account.accountDisplay) && <span className="bank-qr-modal-number">{dialog.account.accountNumber ?? dialog.account.accountDisplay}</span>}</div></div> : null}
          {dialog.kind === "share" && <div className="modal-actions"><button className="button button-primary modal-share" aria-label="Chia sẻ trang" onClick={() => void sharePage()}><Icon name="share" /> Chia sẻ</button><button className="button button-secondary modal-share" aria-label="Sao chép liên kết" onClick={() => void copyText(currentUrl, "liên kết")}><Icon name="copy" /> Sao chép</button></div>}
          {dialog.kind === "bank" && dialog.account && <button className="button button-primary modal-share" aria-label="Tải ảnh QR gốc" onClick={() => void downloadQr(dialog.account!)}><Icon name="download" /> Tải QR</button>}
          <p className="dialog-feedback" role="status" aria-live="polite" aria-atomic="true">{dialogFeedback || "\u00a0"}</p>
        </div>}
      </dialog>
      <div className={`toast ${toast ? "toast-visible" : ""}`} role="status" aria-live="polite" aria-atomic="true" aria-hidden={dialog ? true : undefined}><Icon name="check" />{toast}</div>
    </main>
  );
}
