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
      <div className="bank-card-heading">
        <span className="bank-card-icon"><Icon name={account.id === "momo" ? "qr" : "bank"} /></span>
        <div className="bank-card-title">
          <span className="bank-name">{account.bankName}</span>
          <span className="bank-label">{account.label}</span>
        </div>
      </div>

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
          <span className="bank-detail-label">{account.accountNumber ? "Số tài khoản" : "Thông tin tài khoản"}</span>
          <span className="bank-detail-number">{accountValue}</span>
        </div>}
        <div className="bank-owner-detail"><span className="bank-detail-label">Chủ tài khoản</span><span className="bank-detail-value">{account.accountHolder}</span></div>
      </div>

      <div className="bank-card-actions">
        {account.accountNumber && <button className="text-action" aria-label={`Sao chép số tài khoản ${account.bankName}`} onClick={() => onCopyNumber(account)}><Icon name="copy" /> Sao chép</button>}
        <button className="text-action" onClick={() => onDownloadQr(account)}><Icon name="download" /> Tải QR</button>
      </div>
    </article>
  );
}
