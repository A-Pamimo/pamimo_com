import { useState, useCallback } from 'react';
import { Project } from '../types';

export interface ModalState {
    projectModal: Project | null;
    identityModal: boolean;
    contactModal: boolean;
    blogModal: boolean;
    modalOriginRect: { x: number; y: number; w: number; h: number } | null;
}

export interface ModalActions {
    setProjectModal: (p: Project | null) => void;
    setIdentityModal: (v: boolean) => void;
    setContactModal: (v: boolean) => void;
    setBlogModal: (v: boolean) => void;
    setModalOriginRect: (rect: { x: number; y: number; w: number; h: number } | null) => void;
    closeAll: () => void;
}

export function useStoryModals() {
    const [projectModal, setProjectModal] = useState<Project | null>(null);
    const [identityModal, setIdentityModal] = useState(false);
    const [contactModal, setContactModal] = useState(false);
    const [blogModal, setBlogModal] = useState(false);
    const [modalOriginRect, setModalOriginRect] = useState<{ x: number, y: number, w: number, h: number } | null>(null);

    const closeAll = useCallback(() => {
        setProjectModal(null);
        setIdentityModal(false);
        setContactModal(false);
        setBlogModal(false);
    }, []);

    const isAnyOpen = !!(projectModal || identityModal || contactModal || blogModal);

    return {
        state: {
            projectModal,
            identityModal,
            contactModal,
            blogModal,
            modalOriginRect
        },
        actions: {
            setProjectModal,
            setIdentityModal,
            setContactModal,
            setBlogModal,
            setModalOriginRect,
            closeAll
        },
        isAnyOpen
    };
}
