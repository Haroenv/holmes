export type OnChangeType = (object: HTMLElement) => void;
export type OnInputType = (input: string) => void;

export type OptionsType = {
  input: string,
  find: string,
  placeholder: ?string,
  mark: ?boolean,
  class: {
    visible: ?string,
    hidden: string
  },
  dynamic: ?boolean,
  instant: ?boolean,
  minCharacters: ?number,
  hiddenAttr: ?boolean,
  onHidden: ?OnChangeType,
  onVisible: ?OnChangeType,
  onEmpty: ?OnChangeType,
  onFound: ?OnChangeType,
  onInput: ?OnInputType
};
