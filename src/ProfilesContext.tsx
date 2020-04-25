import * as React from 'react';
import { Profile, ProfileUpdate } from './types';

export type ProfilesContextType = {
  profiles: Profile[];
  add(...profiles: ProfileUpdate[]): void;
  remove(id: string): void;
  update(id: string, profile: Partial<ProfileUpdate>): void;
};

const MISSING_CONTEXT_ERROR = "Couldn't find a valid context for profiles";

export default React.createContext<ProfilesContextType>({
  get profiles(): Profile[] {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  add() {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  remove() {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  update() {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
});
