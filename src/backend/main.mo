import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Type definitions for user subscriptions and proposals
  type SubscriptionPlan = {
    #free;
    #premium;
  };

  type UserProfile = {
    remainingFreeGenerations : Nat;
    totalGenerations : Nat;
    plan : SubscriptionPlan;
  };

  type ProposalInput = {
    clientJobDescription : Text;
    skills : Text;
    experienceLevel : Text;
    portfolioLink : Text;
  };

  type ProposalOutput = {
    upworkFreeProposal : Text;
    coldEmailPitch : Text;
    shortDmPitch : Text;
    pricingBreakdown : Text;
  };

  type SavedProposal = {
    id : Nat; // Add unique identifier
    userId : Principal;
    input : ProposalInput;
    output : ProposalOutput;
    timestamp : Time.Time;
  };

  // State Management
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let savedProposals = Map.empty<Principal, Map.Map<Nat, SavedProposal>>();
  var nextProposalId = 0;

  // Required profile management functions for frontend
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func generateProposal(
    input : ProposalInput,
    _output : ProposalOutput,
  ) : async ProposalOutput {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate proposals");
    };

    // Check if the user has a valid subscription
    let profile = getOrCreateCallerProfile(caller);
    switch (profile.plan) {
      case (#free) {
        if (profile.remainingFreeGenerations == 0) {
          Runtime.trap("Free generations exhausted. Please upgrade to Premium.");
        };
        userProfiles.add(
          caller,
          {
            profile with
            remainingFreeGenerations = profile.remainingFreeGenerations - 1;
            totalGenerations = profile.totalGenerations + 1;
          },
        );
      };
      case (#premium) {
        userProfiles.add(
          caller,
          { profile with totalGenerations = profile.totalGenerations + 1 },
        );
      };
    };
    // Return provided output (in real app, this would include generation logic)
    _output;
  };

  public query ({ caller }) func getUserSubscriptionStatus() : async {
    plan : SubscriptionPlan;
    remainingFreeGenerations : Nat;
    totalGenerations : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view subscription status");
    };

    let profile = getOrCreateCallerProfile(caller);
    {
      plan = profile.plan;
      remainingFreeGenerations = profile.remainingFreeGenerations;
      totalGenerations = profile.totalGenerations;
    };
  };

  public shared ({ caller }) func upgradeToPremium() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upgrade subscription");
    };

    let profile = getOrCreateCallerProfile(caller);
    if (profile.plan == #premium) {
      Runtime.trap("Already on Premium plan");
    };
    userProfiles.add(
      caller,
      {
        profile with
        plan = #premium;
        remainingFreeGenerations = 0;
      },
    );
  };

  // Proposal Saving Logic
  public shared ({ caller }) func saveProposal(input : ProposalInput, output : ProposalOutput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save proposals");
    };

    // Generate unique ID for the proposal
    let newId = nextProposalId;
    nextProposalId += 1;

    let savedProposal : SavedProposal = {
      id = newId;
      userId = caller;
      input;
      output;
      timestamp = Time.now();
    };

    let userProposals = switch (savedProposals.get(caller)) {
      case (null) { Map.empty<Nat, SavedProposal>() };
      case (?proposals) { proposals };
    };
    userProposals.add(newId, savedProposal);
    savedProposals.add(caller, userProposals);
    newId; // Return the new proposal ID
  };

  public query ({ caller }) func getSavedProposals() : async [SavedProposal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view saved proposals");
    };

    switch (savedProposals.get(caller)) {
      case (null) { [] };
      case (?userProposals) {
        userProposals.values().toArray();
      };
    };
  };

  public query ({ caller }) func getProposalById(id : Nat) : async ?SavedProposal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view proposals");
    };

    switch (savedProposals.get(caller)) {
      case (null) { null };
      case (?userProposals) { userProposals.get(id) };
    };
  };

  public shared ({ caller }) func deleteProposal(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete proposals");
    };

    switch (savedProposals.get(caller)) {
      case (null) {
        Runtime.trap("Proposal not found");
      };
      case (?userProposals) {
        if (not userProposals.containsKey(id)) {
          Runtime.trap("Proposal not found");
        };
        userProposals.remove(id);
        if (userProposals.isEmpty()) {
          savedProposals.remove(caller);
        } else {
          savedProposals.add(caller, userProposals);
        };
      };
    };
  };

  // Admin function to view any user's subscription status
  public query ({ caller }) func adminGetUserSubscriptionStatus(user : Principal) : async ?{
    plan : SubscriptionPlan;
    remainingFreeGenerations : Nat;
    totalGenerations : Nat;
  } {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view other users' subscription status");
    };

    switch (userProfiles.get(user)) {
      case (null) { null };
      case (?profile) {
        ?{
          plan = profile.plan;
          remainingFreeGenerations = profile.remainingFreeGenerations;
          totalGenerations = profile.totalGenerations;
        };
      };
    };
  };

  // Helper function to get or initialize caller's profile
  func getOrCreateCallerProfile(userId : Principal) : UserProfile {
    switch (userProfiles.get(userId)) {
      case (?profile) { profile };
      case (null) {
        let newProfile = {
          remainingFreeGenerations = 10;
          totalGenerations = 0;
          plan = #free;
        };
        userProfiles.add(userId, newProfile);
        newProfile;
      };
    };
  };
};
