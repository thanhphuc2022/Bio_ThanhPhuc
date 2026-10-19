export type ContactLink = {
  id: string;
  label: string;
  value: string;
  href: string;
};

export type BankAccount = {
  id: string;
  bankName: string;
  bin?: string;
  accountHolder: string;
  accountNumber?: string;
  accountDisplay?: string;
  label?: string;
  isDefault?: boolean;
  qrImage: {
    src: string;
    originalSrc: string;
    alt: string;
    width: number;
    height: number;
  };
};

export type AvatarImage = {
  src: string;
  alt: string;
  objectPosition: string;
  width: number;
  height: number;
};

export type Profile = {
  fullName: string;
  givenName: string;
  familyName: string;
  jobTitle: string;
  avatar?: AvatarImage;
  contacts: ContactLink[];
  bankAccounts: BankAccount[];
};

export const profile: Profile = {
  fullName: "Hồ Thanh Phúc",
  givenName: "Phúc",
  familyName: "Hồ Thanh",
  jobTitle: "Backend Developer",
  avatar: {
    src: "/images/avatar.png",
    alt: "Ảnh chân dung Hồ Thanh Phúc",
    objectPosition: "50% 36%",
    width: 941,
    height: 1672,
  },
  contacts: [
    {
      id: "github",
      label: "GitHub",
      value: "thanhphuc2022",
      href: "https://github.com/thanhphuc2022",
    },
    {
      id: "facebook",
      label: "Facebook",
      value: "tkphucs.1204",
      href: "https://www.facebook.com/tkphucs.1204",
    },
    {
      id: "zalo",
      label: "Zalo",
      value: "0983222945",
      href: "https://zalo.me/0983222945",
    },
  ],
  bankAccounts: [
    {
      id: "mb",
      bankName: "MB",
      accountHolder: "HO THANH PHUC",
      accountNumber: "870449999",
      label: "Ngân hàng",
      qrImage: {
        src: "/images/QR_MBbank_display.png",
        originalSrc: "/images/QR_MBbank.jpg",
        alt: "Ảnh thông tin và mã QR tài khoản MB của HO THANH PHUC",
        width: 790,
        height: 870,
      },
    },
    {
      id: "momo",
      bankName: "MoMo",
      accountHolder: "HO THANH PHUC",
      accountDisplay: "0983222945",
      label: "Ví điện tử",
      qrImage: {
        src: "/images/QR_Momo_display.png",
        originalSrc: "/images/QR_Momo.jpg",
        alt: "Ảnh thông tin và mã QR ví MoMo của HO THANH PHUC; số điện thoại được che, chỉ thấy ba số cuối 945",
        width: 430,
        height: 430,
      },
    },
    {
      id: "vietinbank",
      bankName: "VietinBank",
      accountHolder: "HO THANH PHUC",
      accountNumber: "100876664937",
      label: "Ngân hàng",
      qrImage: {
        src: "/images/QR_Vietinbank_display.png",
        originalSrc: "/images/QR_Vietinbank.jpg",
        alt: "Ảnh thông tin và mã QR tài khoản VietinBank của HO THANH PHUC",
        width: 666,
        height: 666,
      },
    },
  ],
};
