import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const getUser = async () => await currentUser();

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({req}) => {
      try {
         const user = await getUser();
   
         if (!user) {
            // Handle unauthorized user
            throw new UploadThingError("Unauthorized");
         }
   
         return { userId: user.id };
      } catch (error) {
         // Handle other errors
         console.error("Error in middleware:", error);
         throw new Error("Internal Server Error");
      }
   })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
