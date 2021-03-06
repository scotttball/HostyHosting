import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal, { ModalContent, ModalFooter } from '../ui/Modal';
import Button, { ButtonGroup } from '../ui/Button';
import { useMutation, graphql } from 'react-relay/hooks';
import { CreateApplicationMutation } from './__generated__/CreateApplicationMutation.graphql';
import Form from '../forms/Form';
import Input from '../forms/Input';
import TextArea from '../forms/TextArea';
import SubmitButton from '../forms/SubmitButton';

type Props = {
    organization?: string;
    visible: boolean;
    onClose(): void;
};

export default function CreateApplication({ organization, visible, onClose }: Props) {
    const navigate = useNavigate();

    const [commit, isInFlight] = useMutation<CreateApplicationMutation>(graphql`
        mutation CreateApplicationMutation($input: CreateApplicationInput!) {
            createApplication(input: $input) {
                id
                name
                description
                organization {
                    id
                    username
                }
            }
        }
    `);

    function handleFinish(values: Record<string, string>) {
        commit({
            variables: {
                input: {
                    organizationID: organization,
                    name: values.name,
                    description: values.description,
                },
            },
            onCompleted(data) {
                navigate(
                    `/orgs/${data.createApplication.organization.username}/apps/${data.createApplication.name}`,
                );
            },
        });
    }

    return (
        <Modal open={visible} onClose={onClose}>
            <Form onSubmit={handleFinish} disabled={isInFlight}>
                <ModalContent title="Create Application">
                    <div className="space-y-6">
                        <Input
                            name="name"
                            label="Application Name"
                            register={{ required: true }}
                            autoComplete="off"
                        />
                        <TextArea name="description" label="Description" />
                    </div>
                </ModalContent>
                <ModalFooter>
                    <ButtonGroup>
                        <SubmitButton>Create</SubmitButton>
                        <Button onClick={onClose}>Cancel</Button>
                    </ButtonGroup>
                </ModalFooter>
            </Form>
        </Modal>
    );
}
