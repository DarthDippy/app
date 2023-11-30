"use client";

import { Alert, Notification, UserInput } from "@client";
import { useStore, useModals } from "@/store/store";
import { useState } from "react";

export function Notifications() {
    const [showAlert, setShowAlert] = useState(false);
    const [requestStatus, setRequestStatus] = useState({});

    const notifications = useStore((state) => state.notifications);
    const removeNotification = useStore((state) => state.removeNotification);
    const addModal = useModals((state) => state.addModal);
    const removeModal = useModals((state) => state.removeModal);

    async function handleAction(action, notification) {
        if (action === "ignore") {
            removeNotification(notification);
            return;
        }
        if (action === "accept association") {
        }
        if (action === "join group") {
        }
        if (action === "delete notification") {
            console.log("sorry to hear that");
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASEPATH ?? ""}/api/notifications/${
                notification._id
            }`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action,
                }),
            },
        );

        if (response.status === 200) {
            setRequestStatus({
                success: true,
                message: `You succeeded in the task "${action}"`,
            });
            setShowAlert(true);
            removeNotification(notification);
        } else if (response.status === 401) {
            setRequestStatus({
                success: false,
                message: "You have been signed out. Please sign in again.",
            });
            setShowAlert(true);
            addModal({
                title: "Sign back in",
                content: <UserInput onSubmit={removeModal} />,
            });
        } else {
            setRequestStatus({
                success: false,
                message: `Could not complete task "${action}"`,
            });
            setShowAlert(true);
        }
    }

    return (
        <div>
            <Alert
                timeAlive={5000}
                show={showAlert}
                setShow={setShowAlert}
                success={requestStatus.success}
                message={requestStatus.message}
            />
            {notifications.length > 0 && (
                <ol>
                    {notifications.map((n) => {
                        return (
                            <Notification
                                key={n._id}
                                notification={n}
                                handleAction={handleAction}
                            />
                        );
                    })}
                </ol>
            )}

            {notifications.length === 0 && <p>No current notifications</p>}
        </div>
    );
}
