# RRouter: async code loading example

This example demonstrates how to load code asynchronously. This can be useful
for large applications where it makes sense to split code bundle into several
chunks and load them on-demand.

Execute:

    % make run

Then navigate

    % open http://localhost:8080/

And open a Network of Dev Tools to see how app loads additional code before
rendering a view on page transitions.
