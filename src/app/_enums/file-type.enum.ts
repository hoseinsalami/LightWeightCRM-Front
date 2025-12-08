export enum FileTypeEnum{
  Photo,
  Document,
  Movie
}

export const FileTypeEnum2LabelMapping : Record<FileTypeEnum, string> = {
  [FileTypeEnum.Photo] : 'عکس',
  [FileTypeEnum.Document] : 'فایل',
  [FileTypeEnum.Movie] : 'فیلم',
}
