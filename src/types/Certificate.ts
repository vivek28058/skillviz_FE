export type CertificateType = {
  c_name: string;
  acquired: boolean;
  doc: string;
};

export type Certification = Array<CertificateType> | undefined;
