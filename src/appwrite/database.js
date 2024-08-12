import { conf } from "../conf/conf";
import { Client, Databases, ID, Permission, Role } from "appwrite"

class AppwriteServices {
    Client = new Client();
    databases

    constructor() {
        this.Client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)

        this.databases = new Databases(this.Client)
    }

    async createTask({ taskContent, isCompleted }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabseId,
                conf.appwriteCollectionId,
                ID.unique(),
                { taskContent, isCompleted },
                [
                    Permission.write(Role.any()),                  // Anyone can create new documents
                    Permission.read(Role.any()),                  // Anyone can view this document
                    Permission.update(Role.any()),
                    Permission.delete(Role.any())       // Admins can delete this document
                ]);
        } catch (error) {
            console.log("Appwrite service :: createTask :: error: ", error);
            return false;
        }
    }

    async updateTask(id, { taskContent }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabseId,
                conf.appwriteCollectionId,
                id,
                { taskContent }
            )
        } catch (error) {
            console.log("Appwrite service :: updateTask :: error: ", error);
            return false;
        }
    }

    async updateIsCompleted(id, {isCompleted}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabseId,
                conf.appwriteCollectionId,
                id,
                { isCompleted }
            )
        } catch (error) {
            console.log("Appwrite service :: updateIsCompleted :: error: ", error);
            return false;
        }
    }
    async deleteTask(id) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabseId,
                conf.appwriteCollectionId,
                id
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteTask:: error: ", error);
            return false;
        }
    }

    async getTasks() {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabseId,
                conf.appwriteCollectionId
            )
        } catch (error) {
            console.log("Appwrite service :: getTasks:: error: ", error);
            return false;
        }
    }
}

const appwriteServices = new AppwriteServices();
export { appwriteServices };