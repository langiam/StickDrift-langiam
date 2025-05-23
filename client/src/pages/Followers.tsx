import { useMutation } from '@apollo/client';
import { FOLLOW_PROFILE, UNFOLLOW_PROFILE } from '../utils/mutations';

interface Profile {
    _id: string;
    name: string;
}

interface Props {
    profiles: Profile[];
}

export default function Followers({ profiles }: Props) {
    const [followProfile] = useMutation(FOLLOW_PROFILE);
    const [unfollowProfile] = useMutation(UNFOLLOW_PROFILE);

    const handleFollow = async (profileId: string) => {
        try {
            await followProfile({
                variables: { profileId },
            });
        } catch (error) {
            console.error('Error following profile:', error);
        }
    };

    const handleUnfollow = async (profileId: string) => {
        try {
            await unfollowProfile({
                variables: { profileId },
            });
        } catch (error) {
            console.error('Error unfollowing profile:', error);
        }
    };
    
    return (
        <div>
            <h1>Followers</h1>
            <ul>
                {profiles.map((profile) => (
                    <li key={profile._id}>
                        {profile.name}
                        <button onClick={() => handleFollow(profile._id)}>Follow</button>
                        <button onClick={() => handleUnfollow(profile._id)}>Unfollow</button>
                    </li>
                ))}
            </ul>
            <p>This is the followers list page.</p>
        </div>
    );
};