import React from 'react'

import CollectionBottomSection from '@/design-systems/Organisms/Collection/CollectionBottomSection'
import CollectionUpperSection from '@/design-systems/Organisms/Collection/CollectionUpperSection'

const CollectionTemplate: React.FC = () => {
  return (
    <div>
      <CollectionUpperSection />
      <div className="mt-14">
        <CollectionBottomSection />
      </div>
    </div>
  )
}

export default CollectionTemplate
