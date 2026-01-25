export const initialState = { success: false, message: "" };


export const timeToken = 60 * 60 * 10; //10h ;

export enum ViewMode {
  List = "list",
  Create = "create",
  Edit = "edit",
  View = "view",
}
