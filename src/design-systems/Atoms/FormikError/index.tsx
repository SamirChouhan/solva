import React, { FC } from 'react'
import { FormikState, FormikValues } from 'formik'

import Typography from '../Typography'
interface FormikErrorProps {
  formik: FormikState<FormikValues>
  fieldName: string
}
const FormikError: FC<FormikErrorProps> = ({ formik, fieldName }) => {
  return (
    <>
      {formik.errors[fieldName] && (
        <Typography className="text-error-800">{formik.errors[fieldName]?.toLocaleString()}</Typography>
      )}
    </>
  )
}

export default FormikError
