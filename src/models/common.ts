export type GenericResponse = {
  success: boolean;
  error?: string;
};

export type LoginResponse = {
  token?: string;
  isAccountDisabled?: boolean;
} & GenericResponse;

export type SectionListData<T> = {
  title: string;
  data: T[];
};
