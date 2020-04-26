export type StackParamList = {
  BirthdayList: undefined;
  AddBirthday: undefined;
};

export type Profile = {
  id: string;
  name: string;
  birthday: string;
  avatar?: string;
};

export type ProfileUpdate = Omit<Profile, 'id'> & { id?: never };
