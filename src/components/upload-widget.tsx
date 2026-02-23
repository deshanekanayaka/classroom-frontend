import React, {useEffect, useRef, useState} from 'react'
import {UploadCloud} from "lucide-react";
import {CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET} from "../../constants";
import {UploadWidgetValue} from "../../types";

const UploadWidget = ({value = null, onChange, disabled = false}) => {

    const widgetRef = useRef<CloudinaryWidget | null>(null);
    // Ref to handle changes- to avoid stale closures
    const onChangeREf = useRef(onChange);

    // Whether previewing file or showing upload widget for the first time- so manage a state
    // If a value exists we show otherwise null
    const [preview, setPreview] = useState<UploadWidgetValue | null>(value);

    // For client side deletion
    const [deleteToken, setDeleteToken] = useState<string | null>(null);
    //Change the Ui
    const [isRemoving, setIsRemoving] = useState(false);

    //Open the widget- changes with the input. When a value changes preview is eql to new value
    //If not set delete token to null becz nothing to delete
    useEffect(() => {
        setPreview(value);
        if(!value) setDeleteToken(null);
    }, [value]);

    //Goal - Always keep the onchange parameter
    useEffect(() => {
        onChangeREf.current = onChange;
    }, [onChange]);

    // Initialize cloudinary widget for client side
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initializeWidget = () => {
            if (!window.cloudinary || widgetRef.current) return false;

            widgetRef.current = window.cloudinary.createUploadWidget({
                cloudName: CLOUDINARY_CLOUD_NAME,
                uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                multiple: false,
                folder: 'uploads',
                maxFileSize: 5000000,
                clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp']

            }, (error, result) => {
                if(!error && result.event === 'success') {
                    const payload: UploadWidgetValue = {
                        url: result.info.secure_url,
                        publicId: result.info.public_id,
                    }

                    // @ts-ignore
                    setPreview(payload);
                    setDeleteToken(result.info.delete_token ?? null);
                    onChangeREf.current ?.(payload)
                }

            });
            return true;
        }
        // if something went wrong return otherwise proceed
        if(initializeWidget()) return;

        const intervalId = window.setInterval(() => {
            if (initializeWidget()) {
                window.clearInterval(intervalId);
            }
        }, 500)
        return () => window.clearInterval(intervalId);
    }, []);


    const openWidget = () => {
        if(!disabled) widgetRef.current ?.open();
    }


    return (
        <div className={"space-y-2"}>
        {/* If preview is on */}
            {
                preview ? (
                    <div className="upload-preview">
                        <img src={preview.url} alt="Upload File" />
                    </div>
                ): <div className="upload-dropzone" role={"button"} tabIndex={0}
                        onClick={openWidget} onKeyDown = {(event) => {
                            if (event.key === "Enter" || event.key === " "){
                                event.preventDefault();
                                openWidget();
                            }
                }}
                >
                {/* Showing the widget */}
                    <div className={"upload-prompt"}>
                        <UploadCloud className={"icon"}/>
                        <div>
                            <p>Click to upload photo</p>
                            <p>PNG, JPG upto 5MB</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default UploadWidget
