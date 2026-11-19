import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { LazyLottie } from '@/components/motion/LazyLottie'

export const SuccessCheck: React.FC = () => {
  return (
    <div className="w-16 h-16 mx-auto flex items-center justify-center">
      <LazyLottie
        animationPath="/lottie/check.json"
        loop={false}
        fallback={<CheckCircle2 className="w-16 h-16 text-emerald-600" />}
        className="w-16 h-16"
      />
    </div>
  )
}

export default SuccessCheck
