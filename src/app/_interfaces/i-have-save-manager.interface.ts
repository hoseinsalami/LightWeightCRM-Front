export interface IHaveSaveManagerInterface<T> {
    save();

    isSending :boolean; // loading indicator on button
    _showDialog:boolean; // show dialog variable
    oneObject: T;
}
