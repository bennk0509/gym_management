"use client"
import CountUp from "react-countup"
import { ArrowUpRight, ArrowDownRight, Users } from "lucide-react"

type CardProps = {
    title: string
    number: string | number
    date: string
    durationSec?: number
    prefix?: string
    suffix?: string,
    icon?: React.ReactNode,
  }
  

export default function Card({title,
    number,
    date,
    durationSec = 1.2,
    prefix,
    suffix,
    icon}: CardProps)
{
    const end = typeof number === "number" ? number : parseFloat(number) || 0
    return (
        <div className="bg-white w-full shadow-md rounded-xl p-4 text-center flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <h3 className="font-heading text-sm text-brand-800">{title}</h3>
                {icon}
            </div>
            <p className="font-heading text-3xl font-bold text-brand-800">
                <CountUp
                end={end}
                duration={durationSec}
                separator=","
                prefix={prefix}
                suffix={suffix}
                />
            </p>
            <p className="font-sans text-xs text-brand-500">{date}</p>
        </div>
        // <div className="bg-neutral-light w-full shadow-md rounded-xl p-6 text-center flex flex-col gap-5">
        //   <h3 className="font-heading text-[16px] text-brand-800">{title}</h3>
        //   <p className="font-heading text-2xl text-brand-800">
        //     <CountUp
        //     end={end}
        //     duration={durationSec}
        //     separator=","
        //     prefix={prefix}
        //     suffix={suffix}
        //     />
        //     </p>
        //   <p className="font-sans text-sm text-brand-500">{date}</p>
        // </div>
    )
}