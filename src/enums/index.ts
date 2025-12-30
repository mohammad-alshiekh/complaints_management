export enum ComplaintType {
  ServiceQuality = 0,
  Corruption = 1,
  Delay = 2,
  Misconduct = 3,
  Other = 99,
}

export enum ComplaintStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
  Rejected = 3,
}

export const ComplaintStatusLabels: Record<ComplaintStatus, string> = {
  [ComplaintStatus.Pending]: "Pending",
  [ComplaintStatus.InProgress]: "In Progress",
  [ComplaintStatus.Completed]: "Completed",
  [ComplaintStatus.Rejected]: "Rejected",
};

export enum UserRole {
  Admin = 0,
  Employee = 1,
}

export enum Governorate {
  Damascus = 1,
  RuralDamascus = 2,
  Aleppo = 3,
  Homs = 4,
  Hama = 5,
  Latakia = 6,
  Tartous = 7,
  Idlib = 8,
  DeirEzZor = 9,
  Raqqa = 10,
  Hasakah = 11,
  Daraa = 12,
  Suwayda = 13,
  Quneitra = 14,
}

export enum ActionType {
  StatusChanged = 0,
  AgencyNotesAdded = 1,
  AdditionalInfoRequested = 2,
  TakenOwnership = 3,
  ReleasedOwnership = 4,
}

export const GovernorateNames: Record<Governorate, string> = {
  [Governorate.Damascus]: "Damascus",
  [Governorate.RuralDamascus]: "Rural Damascus",
  [Governorate.Aleppo]: "Aleppo",
  [Governorate.Homs]: "Homs",
  [Governorate.Hama]: "Hama",
  [Governorate.Latakia]: "Latakia",
  [Governorate.Tartous]: "Tartous",
  [Governorate.Idlib]: "Idlib",
  [Governorate.DeirEzZor]: "Deir ez-Zor",
  [Governorate.Raqqa]: "Raqqa",
  [Governorate.Hasakah]: "Hasakah",
  [Governorate.Daraa]: "Daraa",
  [Governorate.Suwayda]: "Suwayda",
  [Governorate.Quneitra]: "Quneitra",
};
