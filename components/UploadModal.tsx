import useUploadModal from "@/hooks/useUploadModel";
import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import uniqid from "uniqid"
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const UploadModal = () => {
    const router= useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useUser();
    const supabaseClient=useSupabaseClient();

    const uploadModal= useUploadModal();
    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues:{
            artist:'',
            title:'',
            song:null,
            artwork:null,
        }
    })

    const onChaange= (open:boolean)=>{
        if(!open){
            reset();
            uploadModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async(values)=>{
        try{
            setIsLoading(true);
            const imageFile=values.artwork?.[0];
            const songFile=values.song?.[0];
            if(!imageFile || !songFile || !user){
                toast.error('Missing fields');
                return;
            }
            const uniqueID = uniqid();
            //sonfg uplaod
            const{
                data:songData,
                error: songError,
            }=await supabaseClient.storage.from('track').upload(`track-${values.title}-${uniqueID}` ,songFile,{
                cacheControl:'3600',
                upsert: false
            });
            
            if(songError){
                setIsLoading(false);
                return toast.error('Failed Track Upload')
            }

            //img uplaod
            const{
                data:imageData,
                error: imageError,
            }=await supabaseClient.storage.from('artwork').upload(`artwork-${values.title}-${uniqueID}` ,imageFile,{
                cacheControl:'3600',
                upsert: false
            });
            
            if(imageError){
                setIsLoading(false);
                return toast.error('Failed Artwork Upload')
            }

            const {
                error: supabaseError
            } = await supabaseClient.from('songs').insert({
                user_id: user.id,
                title: values.title,
                artist: values.artist,
                image_path: imageData.path,
                song_path: songData.path,
            });

            if(supabaseError){
                setIsLoading(false);
                return toast.error(supabaseError.message);
            }
            router.refresh();
            setIsLoading(false);
            toast.success('Uploaded track successfully!');
            reset();
            uploadModal.onClose();

        }catch(error){
            toast.error('Couldnt submit, Something went wrong')
        }finally{
            setIsLoading(false);
        }
        //upload to supabase
    }

    return (
        <Modal 
        title="Add a Track"
        description="Upload an mp3 file"
        isOpen={uploadModal.isOpen}
        onChange={onChaange}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Input 
                id="title"
                disabled={isLoading}
                {...register('title',{required: true})}
                placeholder="Track Title"
                />
                <Input 
                id="artist"
                disabled={isLoading}
                {...register('artist',{required: true})}
                placeholder="Artist Name"
                />
                <div>
                    <div className="pb-1">
                        Select An Audio Track (.mp3 format)
                    </div>
                    <Input 
                    id="song"
                    type="file"
                    disabled={isLoading}
                    accept=".mp3"
                    {...register('song',{required: true})}
                />

                </div>
                <div>
                    <div className="pb-1">
                        Upload Album Artwork (.jpg)
                    </div>
                    <Input 
                    id="artwork"
                    type="file"
                    disabled={isLoading}
                    accept=".jpg"
                    {...register('song',{required: true})}
                />
                </div>
                <Button disabled={isLoading} type="submit">
                    Submit
                </Button>
            </form>
        </Modal>
    );
}

export default UploadModal;