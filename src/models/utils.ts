export type LinkItem = {
  id: string;
  title: string;
  route: string;
  icon: JSX.Element;
};

export type SectionItem<T> = {
  title: string;
  data: T[];
  date: Date;
};

export type ContentTabItem = {
  key: string;
  name: string;
  icon: JSX.Element;
};
