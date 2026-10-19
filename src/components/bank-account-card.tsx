import Image from "next/image";
import type { BankAccount } from "@/data/profile";
import { Icon } from "@/components/icon";

type BankAccountCardProps = {
  account: BankAccount;
  onOpenQr: (account: BankAccount) => void;
  onCopyNumber: (account: BankAccount) => void;
  onDownloadQr: (account: BankAccount) => void;
};

export function BankAccountCard({ account, onOpenQr, onCopyNumber, onDownloadQr }: BankAccountCardProps) {
  const accountValue = account.accountNumber ?? account.accountDisplay;

  return (
    <article className="bank-account-card" aria-label={`${account.bankName} · ${account.accountHolder}`}>
      <button className="qr-preview-button" onClick={() => onOpenQr(account)} aria-label={`Phóng to QR ${account.bankName}`}>
        <span className="qr-image-stage">
          <Image
            src={account.qrImage.src}
            alt={account.qrImage.alt}
            fill
            sizes="(max-width: 650px) calc(100vw - 120px), (max-width: 900px) 350px, 380px"
            loading="eager"
            unoptimized
            style={{ objectFit: "contain" }}
          />
        </span>
      </button>

      <div className="bank-card-details">
        {accountValue && <div className="bank-primary-detail">
          <span className="bank-detail-label">{account.accountNumber ? "Số tài khoản" : "Số điện thoại"}</span>
          <span className="bank-detail-number">{accountValue}</span>
        </div>}
        <div className="bank-owner-detail"><span className="bank-detail-label">Chủ tài khoản</span><span className="bank-detail-value">{account.accountHolder}</span></div>
      </div>

      <div className="bank-card-actions">
        {accountValue && <button className="bank-action bank-action-primary" aria-label={`Sao chép ${account.accountNumber ? "số tài khoản" : "số điện thoại"} ${account.bankName}`} onClick={() => onCopyNumber(account)}><Icon name="copy" /> Sao chép</button>}
        <button className="bank-action bank-action-secondary" onClick={() => onDownloadQr(account)}><Icon name="download" /> Tải QR</button>
      </div>
      <p className="bank-transfer-note">Kiểm tra tên người nhận trước khi chuyển.</p>
    </article>
  );
}
