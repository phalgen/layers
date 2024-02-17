import { useState } from 'react';
import { ScrollView } from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '@context';

import { Section, Type } from '@components/styled';
import { Button, ButtonProps } from '@components/material';
import { FeelsLog, JournalStatus, LayerIndex, Recommend, ViewActivities } from '@components/pages/dashboard';

const Home = () => {
    const { user } = useAuth();
    if (!user) {
        return null;
    }

    const [active, setActive] = useState<'index' | 'feels'>('index');

    const name = user.name.split(' ');
    const firstName = name ? name[0] : '';

    const getButtonProps = (isActive: boolean): ButtonProps => ({
        type: isActive ? "filled" : "outlined",
        icon: isActive ? "layers" : undefined,
        containerColor: isActive ? "bg-primary" : undefined,
        contentColor: isActive ? "text-onPrimary" : 'text-primary',
        onPress: () => {},
        children: '',
    });

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Section stylize='pt-[74px] px-7'>
                <Type weight='bold' stylize='text-displayMedium leading-[52px] tracking-tighter text-onSurface'>Hi,</Type>
                <Type weight='bold' stylize='text-displayMedium leading-[52px] tracking-tighter text-onSurface'>{firstName}!</Type>

                <Section stylize='flex-row mt-7'>
                    <Button {...getButtonProps(active === 'index')} onPress={() => setActive('index')}>Layer Index</Button>
                    <Button {...getButtonProps(active === 'feels')} onPress={() => setActive('feels')} stylize='ml-1'>Feels</Button>
                    <Button type='filled' containerColor='bg-error' contentColor='text-onError' stylize='ml-1' onPress={() => router.push('/home/emergency')}>Emergency</Button>
                </Section>

                {active === 'index' ? (
                    <LayerIndex score={user.score!} stylize='mt-7' />
                ) : (
                    <FeelsLog feel=': )' stylize='mt-7' />
                )}

                <Section stylize='bg-primaryFixed rounded-[50px] overflow-hidden w-full mt-7 mb-20 pt-7 pb-12'>
                    <Section stylize='flex-row justify-between items-center w-full px-7'>
                        <Type stylize='text-headlineMedium text-onSurfaceVariant tracking-tight'>Therapy</Type>
                        <Button type='filled' icon='bookmark-outline' containerColor='bg-primaryFixedDim' contentColor='text-onPrimaryFixedVariant' onPress={() => router.push('/home/records/journalHistory')}>Logs</Button>
                    </Section>

                    <Section stylize='px-[6px] py-5'>
                        <JournalStatus user={user} />
                        <ViewActivities stylize='mt-1' />
                    </Section>

                    <Section stylize='flex-row justify-between items-center w-full px-7'>
                        <Type stylize='text-headlineMedium text-onSurfaceVariant tracking-tight'>Recess Groups</Type>
                        <Button type='filled' icon='language' containerColor='bg-primaryFixedDim' contentColor='text-onPrimaryFixedVariant' stylize='mt-3' onPress={() => router.push('/community/explore')}>More</Button>
                    </Section>

                    <Recommend user={user} />
                </Section>
            </Section>
        </ScrollView>
    );
}
 
export default Home;
