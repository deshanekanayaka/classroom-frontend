import React from 'react'
import {useShow} from "@refinedev/core";
import {ClassDetails} from "../../../types";
import {ShowView, ShowViewHeader} from "@/components/refine-ui/views/show-view.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import { AdvancedImage } from "@cloudinary/react";
import {bannerPhoto} from "@/lib/cloudinary.ts";

const Show = () => {
    // Get access to class data
    const {query} = useShow<ClassDetails>({ resource: "classes" });

    // Get more information from classDetails
    const classDetails = query.data?.data;
    const { isLoading, isError} = query;

    console.log(classDetails);

    //If no class data
    if (isLoading || isError || !classDetails) {
        return (
            <ShowView className={"class-view class-show"}>
                <ShowViewHeader resource="classes" title="Class Details" />

                <p className={"state-message"}>
                    {isLoading ? 'Loading class details...'
                        : isError ? 'Failed to load class details...'
                            : 'Class details not found.'}
                </p>
            </ShowView>
        )
    }

    //Teacher details
    const teacherName = classDetails.teacher?.name ?? 'Unknown';
    //Remove spaces from name, get first letter- uppercase and return
    const teachersInitials = teacherName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join(' ');
    //Profile pic
    const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(teachersInitials || 'NA')}`;


    return (
        <ShowView className="class-view class-show space-y-6">
            <ShowViewHeader resource="classes" title="Class Details" />

            <div className="banner">
                {classDetails.bannerUrl ?
                    <AdvancedImage
                        cldImg={bannerPhoto(
                            classDetails.bannerCldPubId ?? "",
                            classDetails.name
                        )}
                        alt="Class Banner"
                    />
                    :
                    <div className={"placeholder"}></div> }
            </div>

            <Card className="details-card">
                {/* Class Details */}
                <div>
                    <div className="details-header">
                        <div>
                            <h1>{classDetails.name}</h1>
                            <p>{classDetails.description}</p>
                        </div>

                        <div>
                            <Badge variant="outline">{classDetails.capacity} spots</Badge>
                            <Badge
                                variant={
                                    classDetails.status === "active" ? "default" : "secondary"
                                }
                                data-status={classDetails.status}
                            >
                                {classDetails.status.toUpperCase()}
                            </Badge>
                        </div>
                    </div>

                    <div className="details-grid">
                        <div className="instructor">
                            <p>👨‍🏫 Instructor</p>
                            <div>
                                <img
                                    src={classDetails.teacher?.image ?? placeholderUrl}
                                    alt={teacherName}
                                />

                                <div>
                                    <p>{teacherName}</p>
                                    <p>{classDetails?.teacher?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="department">
                            <p>🏛️ Department</p>

                            <div>
                                <p>{classDetails?.department?.name}</p>
                                <p>{classDetails?.department?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Subject Card */}
                <div className="subject">
                    <p>📚 Subject</p>

                    <div>
                        <Badge variant="outline">
                            Code: <span>{classDetails?.subject?.code}</span>
                        </Badge>
                        <p>{classDetails?.subject?.name}</p>
                        <p>{classDetails?.subject?.description}</p>
                    </div>
                </div>

                <Separator />

                {/* Join Class Section */}
                <div className="join">
                    <h2>🎓 Join Class</h2>

                    <ol>
                        <li>Ask your teacher for the invite code.</li>
                        <li>Click on &quot;Join Class&quot; button.</li>
                        <li>Paste the code and click &quot;Join&quot;</li>
                    </ol>
                </div>

                <Button size="lg" className="w-full">
                    Join Class
                </Button>
            </Card>

        </ShowView>
    )
}
export default Show
