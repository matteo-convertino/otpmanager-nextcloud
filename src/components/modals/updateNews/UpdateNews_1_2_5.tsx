import {Anchor, Stack, Text, Title} from "@mantine/core";
import {AppCard} from "@/components/utils/AppCard.tsx";
import appStoreSvg from "@/assets/appstore.svg";

export function UpdateNews_1_2_5() {
    return (
        <Stack>
            <Title order={2}>OTP Manager on iOS (TestFlight)!</Title>

            <Text>
                <strong>OTP Manager is finally available on iOS!</strong> A huge thank you to everyone who contributed on Ko-fi
                and helped us reach the goal. You helped make this happen ❤️.
            </Text>

            <Text>
                <strong>For now, the app is available as a beta through TestFlight.</strong> I'm working on getting it onto the
                App Store, but Apple is making the process a little trickier than expected. I don't have a release
                date to share yet, but you can follow along with the progress{" "}
                <Anchor href="https://github.com/matteo-convertino/otpmanager-app/issues/69" target="_blank" rel="noopener noreferrer">
                    here on GitHub
                </Anchor>.
            </Text>

            <Text>
                In the meantime, you can finally download and use Nextcloud OTP Manager on iOS!
                I hope you enjoy it, and please let me know if you run into any issues.
            </Text>

            <AppCard
                title="OTP Manager"
                description="OTP Manager is an iOS application designed to simplify the
            management of OTP (One-Time Password) codes and allow you to
            access your OTP codes in a secure and convenient way. The
            application has been developed to work in synergy with your
            personal Nextcloud server, which allows you to store and manage
            your OTP codes securely and accessibly from anywhere."
                image={appStoreSvg}
                badges={[{text: "iOS"}]}
                buttons={[
                    {
                        text: "Join the iOS beta on TestFlight",
                        link: "https://testflight.apple.com/join/c4MWN7v6",
                    },
                ]}
            />


        </Stack>
    );
}
