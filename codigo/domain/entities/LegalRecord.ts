export type LegalSanction = {
  authority: string;
  date: string;
  description: string;
};

export type LegalFine = {
  authority: string;
  date: string;
  amount: number;
  currency: string;
};

export type Tender = {
  code: string;
  title: string;
  date: string;
  amount: number | null;
  currency: string | null;
};

export type LegalRecord = {
  companyRuc: string;
  osceSanctions: LegalSanction[];
  osceFines: LegalFine[];
  tenders: Tender[];
};
