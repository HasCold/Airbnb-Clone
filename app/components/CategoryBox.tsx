'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons"
import qs from 'query-string';

interface categoryBoxProps {
    icon : IconType;
    label: string;
    selected? : boolean
}

const CategoryBox: React.FC<categoryBoxProps> = ({
    icon: Icon,
    label,
    selected
}) => {
    const router = useRouter();
    const params = useSearchParams();
    const handleClick = useCallback(() => {
        let currentquery = {};
    
    // we are going a bunch of things in our URL including the search location the start and end date of when we go on a vacation the number guest we want to bring the number of rooms we are searching for all that stuff we need to sure that by clicking on one of those categories, we don't accidentally remove those paramaters we want to able to combine all kind of parameters    

    if(params){
    currentquery = qs.parse(params.toString());
    }

    const updatedquery: any = {
        ...currentquery,
        category: label
    }

    if(params?.get('category') === label){  // we want to deselect it if we were clicking on it again think of it like a toggle on and off 
        delete updatedquery.category;
    }

    const url = qs.stringifyUrl({  // and then we genearte the URL string using query string stringify url 
        url: '/',
        query: updatedquery
    }, {skipNull: true});

    router.push(url);
    },[label, params, router]);
  
    return (
    <div 
    onClick={handleClick}
    className={`
    flex
    flex-col
    items-center
    justify-center
    gap-2
    p-3
    border-b-2
    hover:text-neutral-800
    transition
    cursor-pointer
    ${selected ? `border-b-neutral-800` : `border-transparent`} 
    ${selected ? `text-neutral-800` : `text-neutral-500`} 
    `}>
        <Icon size={26}/>
        <div className="font-medium text-sm" >
        {label}
        </div>        
    </div>
  )
}

export default CategoryBox