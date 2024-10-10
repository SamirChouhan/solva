import React, { PropsWithChildren } from 'react'

import TC from './tandc.mdx'

import Typography from '@/design-systems/Atoms/Typography'

const CustomH1 = (props: PropsWithChildren) => {
  return <Typography className="my-4" size="h2" {...props} />
}

const CustomH2 = (props: PropsWithChildren) => {
  return <Typography className="my-8" size="h3" {...props} />
}

const CustomH3 = (props: PropsWithChildren) => {
  return <Typography className="my-4" size="h4" {...props} />
}

const CustomH4 = (props: PropsWithChildren) => {
  return <Typography className="my-4" size="heading" {...props} />
}

const CustomParagraph = (props: PropsWithChildren) => {
  return <Typography className="my-2" size="paragraph" {...props} />
}

const overrideComponents = {
  h1: CustomH1,
  h2: CustomH2,
  h3: CustomH3,
  h4: CustomH4,
  p: CustomParagraph,
  ul: (props: PropsWithChildren) => <ul className="list my-4 list-disc space-y-2" {...props} />,
  li: (props: PropsWithChildren) => <li className="ms-8 list-disc" {...props} />,
}

const TermsAndConditionTemplate: React.FC = () => {
  return (
    <div>
      <TC components={overrideComponents} />
    </div>
  )
}

export default TermsAndConditionTemplate
