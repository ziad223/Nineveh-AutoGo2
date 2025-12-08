import { CustomTextAriaProps } from "./types/types"

const CustomTextAria = (props: CustomTextAriaProps) => {
    return (
        <div className={`col-span-12 ${props?.className ? props?.className : ""}`}>
            {props.label && (
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    {props?.label}{" "}
                    <span className="bg-custom-gradient bg-clip-text text-transparent font-medium text-[16px]">
                        {props.labelLang}
                    </span>
                </label>
            )}

            <textarea
                rows={4}
                name={props?.name}
                id="name"
                {...props.register(props.name)}
                
                placeholder={props?.placeholder}
                required={props.required ? props.required : false}
                
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-[0px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
        </div>
    )
}

export default CustomTextAria
