import NetInfo from "@react-native-community/netinfo";
import { getUnsyncedNotes, syncNotes } from "./Db";

export const syncDataWithServer = async () => {
    const netInfo = await NetInfo.fetch();
    console.log(netInfo.isConnected);
    if (!netInfo.isConnected) {
        console.log("nointernet");
        return;
    }

    const unsyncedItems = await getUnsyncedNotes();

    if (unsyncedItems.length === 0) {
        console.log("nosyncneeded");
        return;
    }
    try {
        for (const item of unsyncedItems) {
            console.log("itemsynced");
            await syncNotes(item.id);
        }
    } catch (error) {
        console.error("Sync failed:", error);
    }
};

