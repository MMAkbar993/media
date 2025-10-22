import {
  CheckCircle,
  XCircle,
  UserX,
  BadgeDollarSign,
  Headset,
  CreditCard,
  Truck,
  KeyRound,
  CalendarClock,
  ShieldCheck,
} from "lucide-react"

const comparisonData = [
  {
    title: "Bot Followers",
    buzzoid: "None",
    others: "Often use bots",
    icon: <UserX className="w-5 h-5 text-gray-500" />,
  },
  {
    title: "Pricing",
    buzzoid: "Transparent",
    others: "Hidden fees",
    icon: <BadgeDollarSign className="w-5 h-5 text-gray-500" />,
  },
  {
    title: "Support",
    buzzoid: "24/7 US-based",
    others: "Limited",
    icon: <Headset className="w-5 h-5 text-gray-500" />,
  },
  {
    title: "Payment",
    buzzoid: "All major cards",
    others: "Limited options",
    icon: <CreditCard className="w-5 h-5 text-gray-500" />,
  },
  {
    title: "Delivery",
    buzzoid: "Fastest",
    others: "Often slow",
    icon: <Truck className="w-5 h-5 text-gray-500" />,
  },
  {
    title: "Login Info",
    buzzoid: "Not required",
    others: "Often required",
    icon: <KeyRound className="w-5 h-5 text-gray-500" />,
  },
  {
    title: "Established",
    buzzoid: "Since 2012",
    others: "Often newer",
    icon: <CalendarClock className="w-5 h-5 text-gray-500" />,
  },
  {
    title: "Account Safety",
    buzzoid: "Guaranteed safe",
    others: "Often risky",
    icon: <ShieldCheck className="w-5 h-5 text-gray-500" />,
  },
]

const ComparisonSection = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto py-20">
      <h3 className="heading text-center mb-10">How We Compare</h3>
      {/* <div className="absolute top-32 left-1/3 w-[1px] h-[calc(100%-4rem)] bg-orange-500 z-10"></div>
    <div className="absolute top-32 left-2/3 w-[1px] h-[calc(100%-4rem)] bg-gray-200 z-10"></div> */}

      <div className="grid grid-cols-3 rounded-lg overflow-hidden relative z-0">
        {/* Left Column */}
        <div className="divide-y divide-gray-200 mt-16 border border-gray-300 border-r-0 rounded-r-[0px] rounded-2xl">
          {comparisonData.map((item) => (
            <div key={item.title} className="flex items-center justify-start px-6 py-4 gap-3 text-xs text-gray-700">
              {item.icon}
              <span>{item.title}</span>
            </div>
          ))}
        </div>

        {/* Buzzoid Column */}
        <div className="flex flex-col items-center rounded-4xl border-4 border-orange-500">
          <div className="text-center py-6">
            <p className="font-semibold">hypeis.us</p>
          </div>
          {comparisonData.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-2 px-4 py-4 border-t border-gray-300 text-xs text-gray-800 justify-center"
            >
              <CheckCircle className="w-4 h-4 text-orange-500" />
              <span>{item.buzzoid}</span>
            </div>
          ))}
        </div>

        {/* Others Column */}
        <div className="border border-gray-300 border-l-0 rounded-l-[0px] rounded-2xl mt-20">
          {/* <div className="text-center py-6 text-sm font-semibold text-gray-600 border-b">
          Others
        </div> */}
          {comparisonData.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-2 px-6 py-4 border-t border-gray-300 text-xs text-gray-500 justify-center"
            >
              <XCircle className="w-4 h-4 text-gray-400" />
              <span>{item.others}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ComparisonSection
