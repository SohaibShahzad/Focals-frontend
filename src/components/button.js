import Link from "next/link"

export const Button = ({ title, styling, link }) => {
    return(
        <button className={`${styling} rounded-md py-[10px] px-[24px] z-[100]`}>
            <Link href={link}>{title}</Link>
        </button>
    )
}