import { Resolver, Query, Arg, Ctx, FieldResolver, Root, Mutation, Field, Int } from 'type-graphql';
import { Organization } from '../entity/Organization';
import { Context } from '../types';
import { Application } from '../entity/Application';
import { OrganizationMembership } from '../entity/OrganizationMembership';

@Resolver(() => Organization)
export class OrganizationResolver {
    @Query(() => Organization)
    async organization(
        @Ctx() { user }: Context,
        @Arg('username', () => String, {
            nullable: true,
            description:
                'The username of the organization to load. If empty, we will use the signed-in users personal organization.',
        })
        username?: string,
    ) {
        if (!username) {
            return await user.personalOrganization;
        }

        return Organization.findForUser(user, { username });
    }

    @Mutation(() => Organization)
    async UNIMPLEMENTED__changeOrganizationUsername() {
        throw new Error('NOT IMPLEMENTED');
        // if (this.organization.isPersonal) {
        //     throw new Error('Personal organization usernames cannot be changed.');
        // }
        // this.organization.username = username;
        // await this.organizationRepo.save(this.organization);
    }

    @FieldResolver(() => Application)
    async application(
        @Ctx() { user }: Context,
        @Root() organization: Organization,
        @Arg('name') name: string,
    ) {
        return await Application.findForUserAndOrganization(user, organization, name);
    }

    @FieldResolver(() => Int)
    async memberCount(@Root() organization: Organization) {
        return await OrganizationMembership.count({
            where: {
                organization,
            },
        });
    }
}
