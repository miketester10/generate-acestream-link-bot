import { config } from "dotenv";
config({ quiet: true });

export enum AcestreamUrlKey {
  HOME = "HOME",
  SERVER = "SERVER",
}

export const AcestreamUrl: Readonly<Record<AcestreamUrlKey, string>> = {
  [AcestreamUrlKey.HOME]: process.env.ACESTREAM_BASE_URL_HOME!,
  [AcestreamUrlKey.SERVER]: process.env.ACESTREAM_BASE_URL_SERVER!,
};
