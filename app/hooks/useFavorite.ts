import { useRouter } from "next/navigation";
import { SafeUser } from "../types";
import useLoginModal from "./useLoginModal";
import {useMemo, useCallback} from 'react';
import axios from "axios";
import { toast } from "react-hot-toast";

interface IUseFavorite {
    listingId: string;
    currentUser?: SafeUser | null   // | -->> (bitwise operator) On the other hand, the bitwise OR operator (|) operates on individual bits of numeric operands. It performs a bitwise OR operation by comparing the corresponding bits of two operands and returning a new value where each bit is set to 1 if at least one of the corresponding bits in the operands is 1.

    // To summarize, if you need to perform logical operations or handle boolean values, use the logical OR operator (||). If you need to perform bitwise operations on individual bits of numeric operands, use the bitwise OR operator (|).
}

const useFavorite = ({
    listingId,
    currentUser,
} : IUseFavorite) => {
    const router = useRouter();
    const loginModal = useLoginModal();

    const hasFavorite = useMemo(() => {
        const list = currentUser?.favoriteIds || [];

        return list.includes(listingId);
    }, [currentUser, listingId]);

    const toggleFavorite = useCallback(async (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        // By calling e.stopPropagation() within an event handler, you prevent the event from propagating further up the DOM tree. This means that the event will not trigger any other event handlers attached to parent elements of the current element.

        // If you click on the child element, the event will trigger the click event handler for the child element ('Child clicked'). However, since e.stopPropagation() is called within the child's event handler, the event propagation will be stopped. As a result, the parent element's event handler ('Parent clicked') will not be triggered.

        // Without e.stopPropagation(), the event would propagate from the child element to the parent element, triggering both event handlers.

        e.stopPropagation();
        if(!currentUser){
            return loginModal.onOpen();
        }

        try {
            let request;

            if(hasFavorite){
                request = () => axios.delete(`/api/favorites/${listingId}`);
            }else{
                request = () => axios.post(`/api/favorites/${listingId}`);
            }

            await request();
            router.refresh();
            toast.success('Success');
        } catch (error) {
            toast.error("Something went wrong");
        }
      },[currentUser, hasFavorite, listingId, loginModal, router]);

      return {
          hasFavorite,
          toggleFavorite
        }
}

export default useFavorite;
