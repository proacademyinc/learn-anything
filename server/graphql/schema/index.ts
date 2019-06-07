import { prisma } from "../../database/generated/client";
import datamodelInfo from "../../database/generated/nexus-prisma";
import { prismaObjectType, makePrismaSchema } from "nexus-prisma";
const path = require("path");

const User = prismaObjectType({
  name: "User",
  definition(t) {
    t.prismaFields(["name", "id", "avatarUrl"]);
  }
});

const Query = prismaObjectType({
  name: "Query",
  definition(t) {
    t.prismaFields([
      {
        name: "user",
        args: ["where"]
      }
    ]);
    t.field("viewer", {
      type: "User",
      nullable: true,
      resolve: (_, __, ctx) =>
        ctx.viewerId ? ctx.prisma.user({ id: ctx.viewerId }) : null
    });
  }
});

const schema = makePrismaSchema({
  types: [Query, User],
  prisma: {
    datamodelInfo,
    client: prisma
  },
  outputs: {
    schema: path.join(__dirname, "../schema.graphql"),
    typegen: path.join(__dirname, "../types.generated.ts")
  },
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, "../../types.ts"),
        alias: "types"
      }
    ],
    contextType: "types.Context"
  }
});

export default schema;
