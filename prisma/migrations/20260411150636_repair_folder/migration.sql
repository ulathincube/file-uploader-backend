-- DropIndex
DROP INDEX "Folder_name_key";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "folderId" DROP DEFAULT;
