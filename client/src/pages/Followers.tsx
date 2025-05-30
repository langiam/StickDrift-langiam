import { useMutation } from '@apollo/client';
import { FOLLOW_PROFILE, UNFOLLOW_PROFILE } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Auth from '../utils/auth';
import { useEffect } from 'react';

interface Profile {
    _id: string;
    name: string;
}

export default function Followers() {
    const { loading, data, error, refetch } = useQuery(QUERY_ME);
    const [followProfile] = useMutation(FOLLOW_PROFILE);
    const [unfollowProfile] = useMutation(UNFOLLOW_PROFILE);

    const profiles: Profile[] = data?.me?.followers || [];
    const profilesFollowing: Profile[] = data?.me?.following || [];
    console.log('Data:', data);
    console.log('Profiles:', profiles);
    console.log('Profiles Following:', profilesFollowing);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const handleFollow = async (profileId: string) => {
        try {
            await followProfile({
                variables: { profileId },
            });
            refetch();
        } catch (error) {
            console.error('Error following profile:', error);
        }
    };

    const handleUnfollow = async (profileId: string) => {
        try {
            await unfollowProfile({
                variables: { profileId },
            });
            refetch();
        } catch (error) {
            console.error('Error unfollowing profile:', error);
        }
    };

    const currentProfileId = Auth.loggedIn() ? Auth.getProfile().data._id : null;

    const isFollowing = (profileId: string) =>
        profilesFollowing.some((profile) => profile._id === profileId);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Followers</h1>
            <ul>
                {profiles.map((profile) => (
                    <li key={profile._id}>
                        <Link to={`/profiles/${profile._id}`}>{profile.name}</Link>
                        {profile._id !== currentProfileId && (
                            isFollowing(profile._id) ? (
                                <button onClick={() => handleUnfollow(profile._id)}>Unfollow</button>
                            ) : (
                                <button onClick={() => handleFollow(profile._id)}>Follow</button>
                            )
                        )}
                        {/* <button onClick={() => handleFollow(profile._id)}>Follow</button>
                        <button onClick={() => handleUnfollow(profile._id)}>Unfollow</button> */}
                    </li>
                ))}
            </ul>
            <h1>Following</h1>
            <ul>
                {profilesFollowing.map((profile) => (
                    <li key={profile._id}>
                        <Link to={`/profiles/${profile._id}`}>{profile.name}</Link>
                        {profile._id !== currentProfileId && (
                            isFollowing(profile._id) ? (
                                <button onClick={() => handleUnfollow(profile._id)}>Unfollow</button>
                            ) : (
                                <button onClick={() => handleFollow(profile._id)}>Follow</button>
                            )
                        )}
                        {/* <button onClick={() => handleFollow(profile._id)}>Follow</button>
                        <button onClick={() => handleUnfollow(profile._id)}>Unfollow</button> */}
                    </li>
                ))}
            </ul>
            <p>This is the followers list page.</p>
        </div>
    );
};