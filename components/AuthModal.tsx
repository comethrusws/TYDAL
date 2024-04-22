"use cllient"

import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

import Modal from "./Modal";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import useAuthModal from "@/hooks/useAuthModal";
import { useEffect } from "react";

const AuthModal = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const { session } = useSessionContext();
    const {onClose, isOpen} = useAuthModal();

    useEffect(()=>{
        if(session){
            router.refresh();
            onClose();
        }
    },[session,router,onClose])

    const onChange= (open:boolean)=>{
        if(!open){
            onClose();
        }
    }

    return (
        <Modal title="Welcome Back!" description="Log back in to your account" isOpen={isOpen} onChange={()=>{}}>
            <Auth supabaseClient={supabaseClient}
            magicLink
            theme="dark"
            providers={["google"]}
            appearance={{
                theme: ThemeSupa,
                variables:{
                    default:{
                        colors:{
                            brand: '#404040',
                            brandAccent: '#22c550'
                        }
                    }
                }
            }}/>
        </Modal>
    );
}

export default AuthModal;