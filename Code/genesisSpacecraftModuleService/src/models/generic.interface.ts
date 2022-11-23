import { RowDataPacket } from "mysql2";

const ConvertRowPacketToObject = (packet: RowDataPacket) => {
    // Loop through all of the properties on the packet
    console.log(packet);
};