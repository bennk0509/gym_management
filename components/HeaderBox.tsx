type HeaderBoxProps = {
    title?: string
    subtext?: string
}
export default function HeaderBox({title, subtext}: HeaderBoxProps)
{
    return(
        <div className="">
            <h3 className="font-heading text-xl text-brand-800">
                {title}
            </h3>
            <p className="font-sans text-base text-brand-500">
                {subtext}
            </p>
        </div>
    )
}