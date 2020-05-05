import { Resolver, FieldResolver, Int, Root, Arg } from 'type-graphql';
import { Component } from '../entity/Component';
import * as pricing from '../utils/pricing';
import { ContainerGroup } from '../entity/ContainerGroup';
import { getRepository } from 'typeorm';

@Resolver(() => Component)
export class ComponentResolver {
    constructor(private containerGroupRepo = getRepository(ContainerGroup)) {}

    @FieldResolver(() => Int)
    async monthlyPrice(@Root() component: Component) {
        const containerGroups = await component.containerGroups;
        return containerGroups.reduce(
            (acc, containerGroup) =>
                acc +
                pricing.calculateMonthlyCost(containerGroup.size, containerGroup.containerCount),
            0,
        );
    }

    @FieldResolver(() => ContainerGroup, { nullable: true })
    containerGroup(
        @Root() component: Component,
        @Arg('environment', () => Int) environmentID: number,
    ) {
        return this.containerGroupRepo.findOne({
            where: {
                component,
                environment: {
                    id: environmentID,
                },
            },
        });
    }
}
