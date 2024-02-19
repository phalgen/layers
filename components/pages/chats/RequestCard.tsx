import { Timestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

import { Section, Type } from "@components/styled";
import { Card, Icon } from "@components/material";
import { Pressable } from "react-native";

interface RequestCardProps {
    username: string;
    time: Timestamp;
    onSuccess: () => void;
    onDecline: () => void;
}

export const RequestCard = ({ username, time, onSuccess, onDecline }: RequestCardProps) => {
    const postTime = time?.toDate().getTime();
    const getTimeAgo = () => {
        if (!postTime) return "";
        return formatDistanceToNow(postTime, { addSuffix: true });
    };

    return(
        <Card stylize="py-5 pl-5 pr-6">
            <Section stylize="flex-row justify-between items-center">
                <Section stylize="flex-row justify-center items-center">
                    <Section stylize='flex justify-center items-center bg-primaryContainer rounded-full w-10 h-10'>
                        <Icon family='materialCommunity' name='account-outline' color='primary' size={24} />
                    </Section>
                    <Section stylize="ml-2">
                        <Type stylize="text-bodyMedium text-onSurface">{username}</Type>
                        <Type stylize="text-bodySmall text-onSurfaceVariant">{getTimeAgo()}</Type>
                    </Section>
                </Section>

                <Section stylize="flex-row justify-center items-center">
                    <Icon name="close" color="onSurface" onPress={onDecline} />
                    <Pressable onPress={onSuccess}>
                        <Section stylize='flex justify-center items-center bg-primary rounded-full w-10 h-10 ml-6'>
                            <Icon name='check' color='onPrimary' size={24} />
                        </Section>
                    </Pressable>
                </Section>
            </Section>
        </Card>
    );
};
