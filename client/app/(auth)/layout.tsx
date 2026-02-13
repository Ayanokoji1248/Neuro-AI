import { Brain } from "lucide-react"
import { ReactNode } from "react"

const AuthLayout = ({ children }: {
    children: ReactNode
}) => {
    return (
        <div className="min-h-screen flex">
            {/* Left Side: Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center p-12 text-white">
                <div className="max-w-lg text-center">
                    <Brain className="w-24 h-24 mx-auto mb-8 opacity-90" />
                    <h2 className="text-4xl font-bold mb-6">Experience the future of neuro-imaging.</h2>
                    <p className="text-blue-100 text-lg leading-relaxed">
                        Our AI-powered platform helps thousands of medical professionals and patients gain clarity on complex MRI scans.
                    </p>
                    <div className="mt-12 space-y-6">
                        <div className="bg-blue-700/50 p-6 rounded-2xl text-left border border-blue-400/30">
                            <p className="italic font-medium text-blue-50">&quot;The speed and accuracy of the analysis changed how I review scans. It&apos;s a game-changer.&quot;</p>
                            <div className="mt-4 flex items-center">
                                <div className="w-10 h-10 bg-blue-400 rounded-full mr-3"></div>
                                <div>
                                    <p className="font-bold text-sm">Dr. Sarah Mitchell</p>
                                    <p className="text-xs text-blue-200">Radiologist, General Hospital</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-12 bg-slate-50 lg:bg-white relative overflow-hidden">
                {children}
            </div>
        </div >
    )
}

export default AuthLayout