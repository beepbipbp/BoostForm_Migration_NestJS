import { FormState } from "types/form.type";

type FormAction =
  | { type: "CHANGE_TITLE"; value: string }
  | { type: "CHANGE_DESCRIPTION"; value: string }
  | { type: "CHANGE_QUESTION_TITLE"; value: string; questionIndex: number }
  | { type: "CHANGE_QUESTION_TYPE"; value: "checkbox" | "multiple" | "paragraph"; questionIndex: number }
  | { type: "ADD_QUESTION_CHOICE"; questionIndex: number }
  | { type: "MODIFY_QUESTION_CHOICE"; questionIndex: number; choiceIndex: number; value: string }
  | { type: "DELETE_QUESTION_CHOICE"; questionIndex: number; choiceIndex: number }
  | { type: "DELETE_QUESTION"; questionIndex: number }
  | { type: "COPY_QUESTION"; questionIndex: number }
  | { type: "CHANGE_QUESTION_ESSENTIAL"; questionIndex: number }
  | { type: "SELECT_FORM_CATEGORY"; value: string }
  | { type: "FETCH_DATA"; init: FormState }
  | { type: "CHANGE_LOGIN_REQUIRED" }
  | { type: "CHANGE_ON_BOARD_SHARED" };

export default FormAction;
