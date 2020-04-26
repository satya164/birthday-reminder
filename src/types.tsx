export type StackParamList = {
  BirthdayList: undefined;
  AddBirthday: undefined;
  EditProfile: { profile: Partial<Profile>; mode: 'create' | 'edit' };
};

export type Profile = {
  id: string;
  name: string;
  birthday: string;
  avatar?: string;
  phones?: string[];
};

export type ProfileUpdate = Omit<Profile, 'id'> & { id?: never };
