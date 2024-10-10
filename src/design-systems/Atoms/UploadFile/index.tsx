import Button from '../Button'

import { UploadFileProps } from './interface'

const UploadFile: React.FC<UploadFileProps> = ({ handleChangeFile, message }) => {
  return (
    <>
      <label className="flex cursor-pointer flex-col items-center gap-[14px]">
        <input accept="image/*" className="hidden" id="file-upload" type="file" onChange={handleChangeFile} />
        <Button>{message}</Button>
      </label>
    </>
  )
}

export default UploadFile
