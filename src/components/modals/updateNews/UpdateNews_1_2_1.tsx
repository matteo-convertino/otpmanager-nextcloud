import {Anchor, Divider, Group, Image, Stack, Text, Title} from "@mantine/core";
import browserExtensionScreenshot from "@/assets/browser_extension_screenshot.png";
import googleFormScreenshot from "@/assets/google_form_screenshot.png";
import kofiGoalScreenshot from "@/assets/kofi_goal_screenshot.png";
import chromeImage from "@/assets/chrome.svg";
import firefoxImage from "@/assets/firefox.svg";
import {IconExternalLink} from "@tabler/icons-react";
import KofiButton from "@/components/KofiButton.tsx";

export function UpdateNews_1_2_1() {
    return (
        <Stack>
            <Title order={2}>New Browser Extension</Title>

            <Image
                src={browserExtensionScreenshot}
                w={"100%"}
                fit="contain"
            />

            <Text>
                The official OTP Manager browser extension is now available. You can install it directly from the Chrome
                and Firefox stores.
            </Text>

            <Stack>
                <Anchor href="https://chromewebstore.google.com/detail/ljbdflkioncfbcncbnijleofalpakhlf" target="_blank">
                    <Group align={"center"} spacing={"xs"}>
                        <Image
                            src={chromeImage}
                            height={22}
                            width={22}
                            fit="contain"
                        />
                        <Text fz={"sm"}>Go to Chrome Web Store</Text>
                        <IconExternalLink size={14}/>
                    </Group>
                </Anchor>


                <Anchor href="https://addons.mozilla.org/firefox/addon/nextcloud-otp-manager/" target="_blank">
                    <Group align={"center"} spacing={"xs"}>
                        <Image
                            src={firefoxImage}
                            height={22}
                            width={22}
                            fit="contain"
                        />
                        <Text fz={"sm"}>Go to Add-ons for Firefox</Text>
                        <IconExternalLink size={14}/>
                    </Group>
                </Anchor>
            </Stack>

            <Divider my={"lg"}/>

            <Title order={2}>News about iOS app</Title>

            <Group grow>
                <Image
                    src={googleFormScreenshot}
                    height={300}
                />
                <Image
                    src={kofiGoalScreenshot}
                    fit="cover"
                    height={300}
                />
            </Group>

            <Text>
                Thank you to everyone who has already donated ❤️. To be honest, I didn’t think we’d reach almost half our <i>goal</i> in two weeks.
                We’re halfway there. If anyone has filled in the form and would like to donate, now’s the time to do it!
            </Text>

            <KofiButton
                username="matteoconvertino"
                label="Donate for the iOS app"
            />
        </Stack>
    );
}
