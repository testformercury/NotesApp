import NetInfo from "@react-native-community/netinfo";
import { getUnsyncedNotes, syncNotes } from "./Db";

export const syncDataWithServer = async () => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
        return;
    }

    const unsyncedItems = await getUnsyncedNotes();

    if (unsyncedItems.length === 0) {
        return;
    }
    try {
        for (const item of unsyncedItems) {
            await syncNotes(item.id);
        }
    } catch (error) {
        console.error("Sync failed:", error);
    }
};

